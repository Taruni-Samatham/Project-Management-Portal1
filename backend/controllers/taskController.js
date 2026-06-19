const Task = require('../models/Task');

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, sortBy, page = 1, limit = 10 } = req.query;
    
    // Construct query object
    const query = { user: req.user.id };

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Determine sort options
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions[field] = order === 'asc' ? 1 : -1;
    }

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ success: false, message: 'Please add a task title' });
    }

    const allowedStatus = ['Pending', 'In Progress', 'Completed'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Find task
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    // Validation
    const allowedStatus = ['Pending', 'In Progress', 'Completed'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics for tasks
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count tasks per status
    const total = await Task.countDocuments({ user: userId });
    const pending = await Task.countDocuments({ user: userId, status: 'Pending' });
    const inProgress = await Task.countDocuments({ user: userId, status: 'In Progress' });
    const completed = await Task.countDocuments({ user: userId, status: 'Completed' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
