import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  ClockCircleOutlined, 
  SyncOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const TaskStats = ({ stats, loading }) => {
  return (
    <div className="stats-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card total-tasks" loading={loading} bordered={false}>
            <Statistic
              title="Total Tasks"
              value={stats.total || 0}
              valueStyle={{ color: '#fff' }}
              prefix={<FileTextOutlined className="stat-icon" />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card pending-tasks" loading={loading} bordered={false}>
            <Statistic
              title="Pending"
              value={stats.pending || 0}
              valueStyle={{ color: '#fff' }}
              prefix={<ClockCircleOutlined className="stat-icon" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card in-progress-tasks" loading={loading} bordered={false}>
            <Statistic
              title="In Progress"
              value={stats.inProgress || 0}
              valueStyle={{ color: '#fff' }}
              prefix={<SyncOutlined spin={stats.inProgress > 0} className="stat-icon" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card completed-tasks" loading={loading} bordered={false}>
            <Statistic
              title="Completed"
              value={stats.completed || 0}
              valueStyle={{ color: '#fff' }}
              prefix={<CheckCircleOutlined className="stat-icon" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskStats;
