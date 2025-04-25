import { Table, Tag, Button, Space, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

interface ApprovalRecord {
  id: string;
  applicant: string;
  purpose: string;
  destination: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
}

const ApprovalList = () => {
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);

  const handleApprove = async () => {
    try {
      // TODO: 实现审批通过的逻辑
      message.success('审批通过');
      setApprovalModalVisible(false);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleReject = async () => {
    try {
      // TODO: 实现审批拒绝的逻辑
      message.success('已拒绝申请');
      setApprovalModalVisible(false);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const columns: ColumnsType<ApprovalRecord> = [
    {
      title: '申请编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '用车目的',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'gold', text: '待审批' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <Button
              type="link"
              onClick={() => {
                setSelectedRecord(record);
                setApprovalModalVisible(true);
              }}
            >
              审批
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data: ApprovalRecord[] = [
    {
      id: 'REQ001',
      applicant: '张三',
      purpose: '项目调研',
      destination: '科技园',
      startTime: '2024-04-25 09:00',
      endTime: '2024-04-25 18:00',
      status: 'pending',
      createTime: '2024-04-24 14:30',
    },
    // 可以添加更多模拟数据
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title="审批处理"
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        footer={[
          <Button key="reject" danger onClick={handleReject}>
            拒绝
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            通过
          </Button>,
        ]}
      >
        <p>申请编号：{selectedRecord?.id}</p>
        <p>申请人：{selectedRecord?.applicant}</p>
        <p>用车目的：{selectedRecord?.purpose}</p>
        <p>目的地：{selectedRecord?.destination}</p>
        <p>开始时间：{selectedRecord?.startTime}</p>
        <p>结束时间：{selectedRecord?.endTime}</p>
      </Modal>
    </div>
  );
};

export default ApprovalList; 