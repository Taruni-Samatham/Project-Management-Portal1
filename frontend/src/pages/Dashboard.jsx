import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  Modal, 
  message, 
  Typography,
  Card,
  Tooltip
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import TaskStats from '../components/TaskStats';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Search/Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  
  // Pagination states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks({
        search: searchText,
        status: statusFilter,
        sortBy,
        page: pagination.current,
        limit: pagination.pageSize,
      });

      if (response.success) {
        setTasks(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, sortBy, pagination.current, pagination.pageSize]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await taskService.getTaskStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load statistics', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle pagination changes
  const handleTableChange = (pagination) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  // Delete task action with confirmation
  const showDeleteConfirm = (id, title) => {
    confirm({
      title: 'Are you sure you want to delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: `Task Title: ${title}`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          const response = await taskService.deleteTask(id);
          if (response.success) {
            message.success('Task deleted successfully');
            // Refresh data
            fetchTasks();
            fetchStats();
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete task');
        }
      },
    });
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text) => <strong className="task-title-cell">{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      render: (text) => (
        <span className="task-description-cell">
          {text || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No description provided.</span>}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => {
        let color = 'gold';
        if (status === 'Completed') color = 'green';
        if (status === 'In Progress') color = 'blue';
        return (
          <Tag color={color} className="status-tag">
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (dateString) => new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Task">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => navigate(`/edit-task/${record._id}`)}
              className="action-btn-edit"
            />
          </Tooltip>
          <Tooltip title="Delete Task">
            <Button 
              type="text" 
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
              onClick={() => showDeleteConfirm(record._id, record.title)}
              className="action-btn-delete"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div>
          <Title level={2} style={{ margin: 0, color: '#1e293b' }}>Workspace Overview</Title>
          <Typography.Paragraph type="secondary" style={{ margin: '4px 0 0 0' }}>
            Monitor and organize task progression
          </Typography.Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          onClick={() => navigate('/create-task')}
          className="create-task-btn"
        >
          Create New Task
        </Button>
      </div>

      {/* Task Statistics */}
      <TaskStats stats={stats} loading={statsLoading} />

      {/* Filter and Search Bar Card */}
      <Card className="filter-card" bordered={false}>
        <div className="filters-container">
          <Input
            placeholder="Search by title..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            className="filter-search"
            allowClear
          />

          <div className="filter-selects">
            <div className="filter-item">
              <span className="filter-label">Status:</span>
              <Select
                defaultValue="All"
                style={{ width: 140 }}
                onChange={(value) => {
                  setStatusFilter(value);
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
              >
                <Option value="All">All Statuses</Option>
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Sort By:</span>
              <Select
                defaultValue="createdAt:desc"
                style={{ width: 180 }}
                onChange={(value) => {
                  setSortBy(value);
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
              >
                <Option value="createdAt:desc">Newest Created</Option>
                <Option value="createdAt:asc">Oldest Created</Option>
                <Option value="title:asc">Title: A to Z</Option>
                <Option value="title:desc">Title: Z to A</Option>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card className="table-card" bordered={false}>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
          }}
          loading={loading}
          onChange={handleTableChange}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
