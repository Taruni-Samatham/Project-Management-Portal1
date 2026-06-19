import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Typography, message, Spin } from 'antd';
import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import taskService from '../services/taskService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TaskFormPage = () => {
  const { id } = useParams(); // If present, we are in Edit Mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load task details if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchTaskDetails = async () => {
        setLoading(true);
        try {
          const response = await taskService.getTaskById(id);
          if (response.success && response.data) {
            form.setFieldsValue({
              title: response.data.title,
              description: response.data.description,
              status: response.data.status,
            });
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to load task details');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };

      fetchTaskDetails();
    }
  }, [id, isEditMode, form, navigate]);

  // Submit form data
  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      if (isEditMode) {
        const response = await taskService.updateTask(id, values);
        if (response.success) {
          message.success('Task updated successfully!');
          navigate('/dashboard');
        }
      } else {
        const response = await taskService.createTask(values);
        if (response.success) {
          message.success('Task created successfully!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-page-header">
        <Button 
          type="default" 
          icon={<RollbackOutlined />} 
          onClick={() => navigate('/dashboard')}
          className="back-btn"
        >
          Back to Workspace
        </Button>
      </div>

      <Card className="form-card" bordered={false}>
        <Title level={2} className="form-title">
          {isEditMode ? 'Modify Task Details' : 'Create a New Task'}
        </Title>
        <Typography.Paragraph type="secondary" className="form-subtitle">
          {isEditMode 
            ? 'Adjust details, status, or description of your project item' 
            : 'Fill in the information below to start tracking a new item'
          }
        </Typography.Paragraph>

        {loading ? (
          <div className="form-spinner-container">
            <Spin size="large" tip="Loading task details..." />
          </div>
        ) : (
          <Form
            form={form}
            name="task_form"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ status: 'Pending' }}
            size="large"
          >
            <Form.Item
              name="title"
              label="Task Title"
              rules={[
                { required: true, message: 'Please enter a task title!' },
                { max: 100, message: 'Title cannot exceed 100 characters!' }
              ]}
            >
              <Input placeholder="Enter title (e.g. Design Landing Page)" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ max: 1000, message: 'Description cannot exceed 1000 characters!' }]}
            >
              <TextArea 
                rows={5} 
                placeholder="Describe what needs to be done..." 
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={submitLoading}
                className="submit-task-btn"
                block
              >
                {isEditMode ? 'Update Task' : 'Add Task'}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default TaskFormPage;
