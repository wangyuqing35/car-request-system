import { Button, Space, Table, Input, Modal, message, Card, Tag } from 'antd';
import { SearchOutlined, ExportOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../../utils/exportToExcel';
import { Request } from '../../types';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

const { Search } = Input;

const RequestList = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRequests = localStorage.getItem('carRequests');
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      setRequests(parsedRequests);
      setFilteredRequests(parsedRequests);
    }
  }, []);

  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredRequests(requests);
      return;
    }
    const filtered = requests.filter(request => 
      request.purpose.toLowerCase().includes(value.toLowerCase()) ||
      request.destination.toLowerCase().includes(value.toLowerCase()) ||
      request.passengers.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  const handleExport = () => {
    if (filteredRequests.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }
    exportToExcel(filteredRequests);
    message.success('导出成功');
  };

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleEdit = (request: Request) => {
    localStorage.setItem('currentEditRequest', JSON.stringify(request));
    navigate(`/edit/${request.id}`);
  };

  const handleDelete = (ids: React.Key[]) => {
    if (ids.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${ids.length} 条记录吗？`,
      onOk: () => {
        const updatedRequests = requests.filter(r => !ids.includes(r.id));
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        localStorage.setItem('carRequests', JSON.stringify(updatedRequests));
        setSelectedRowKeys([]);
        message.success('删除成功');
      }
    });
  };

  const handleCreate = () => {
    navigate('/create');
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审批' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<Request> = [
    {
      title: '申请编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string, record: Request) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '用车目的',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 200,
      ellipsis: true,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 120,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 140,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 140,
    },
    {
      title: '乘车人数',
      dataIndex: 'passengers',
      key: 'passengers',
      width: 80,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className="request-list-container">
      <Card className="request-list-card">
        <div className="request-list-header">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建申请
            </Button>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(selectedRowKeys)}
              danger
            >
              批量删除
            </Button>
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
            <Search
              className="request-list-search"
              placeholder="搜索用车目的、目的地或乘车人"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Space>
        </div>
        <Table
          className="request-list-table"
          columns={columns}
          dataSource={filteredRequests}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        className="request-list-modal"
        title="申请详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setIsModalVisible(false);
            handleEdit(selectedRequest!);
          }}>
            编辑
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRequest && (
          <div className="request-list-modal-content">
            <div className="detail-item">
              <strong>申请编号：</strong>
              <span>{selectedRequest.id}</span>
            </div>
            <div className="detail-item">
              <strong>用车目的：</strong>
              <span>{selectedRequest.purpose}</span>
            </div>
            <div className="detail-item">
              <strong>目的地：</strong>
              <span>{selectedRequest.destination}</span>
            </div>
            <div className="detail-item">
              <strong>开始时间：</strong>
              <span>{selectedRequest.startTime}</span>
            </div>
            <div className="detail-item">
              <strong>结束时间：</strong>
              <span>{selectedRequest.endTime}</span>
            </div>
            <div className="detail-item">
              <strong>乘车人数：</strong>
              <span>{selectedRequest.passengers}</span>
            </div>
            <div className="detail-item">
              <strong>创建时间：</strong>
              <span>{selectedRequest.createTime}</span>
            </div>
            <div className="detail-item">
              <strong>状态：</strong>
              <span>{getStatusTag(selectedRequest.status)}</span>
            </div>
            {selectedRequest.remarks && (
              <div className="detail-item">
                <strong>备注：</strong>
                <span>{selectedRequest.remarks}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestList; 