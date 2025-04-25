import { Form, Input, DatePicker, Button, Card, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Request } from '../../types';
import './index.css';

interface CarRequestForm {
  purpose: string;
  destination: string;
  startTime: Dayjs;
  endTime: Dayjs;
  passengers: string;
  remarks?: string;
}

const CarRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      // 从 localStorage 获取所有申请数据
      const existingRequests = JSON.parse(localStorage.getItem('carRequests') || '[]');
      // 找到当前编辑的申请
      const currentRequest = existingRequests.find((request: Request) => request.id === id);
      
      if (currentRequest) {
        form.setFieldsValue({
          purpose: currentRequest.purpose,
          destination: currentRequest.destination,
          startTime: dayjs(currentRequest.startTime),
          endTime: dayjs(currentRequest.endTime),
          passengers: currentRequest.passengers,
          remarks: currentRequest.remarks
        });
      } else {
        message.error('未找到申请记录');
        navigate('/request-list');
      }
    }
  }, [isEditMode, form, id, navigate]);

  const onFinish = async (values: CarRequestForm) => {
    try {
      // 格式化时间
      const formatTime = (time: Dayjs) => time.format('YYYY-MM-DD HH:mm');
      
      if (isEditMode) {
        // 编辑模式：更新现有申请
        const existingRequests = JSON.parse(localStorage.getItem('carRequests') || '[]');
        const updatedRequests = existingRequests.map((request: Request) => {
          if (request.id === id) {
            return {
              ...request,
              purpose: values.purpose,
              destination: values.destination,
              startTime: formatTime(values.startTime),
              endTime: formatTime(values.endTime),
              passengers: values.passengers,
              remarks: values.remarks
            };
          }
          return request;
        });
        localStorage.setItem('carRequests', JSON.stringify(updatedRequests));
        message.success('修改成功');
      } else {
        // 创建模式：添加新申请
        const requestId = 'REQ' + Date.now().toString().slice(-6);
        const newRequest = {
          id: requestId,
          purpose: values.purpose,
          destination: values.destination,
          startTime: formatTime(values.startTime),
          endTime: formatTime(values.endTime),
          passengers: values.passengers,
          remarks: values.remarks,
          status: 'pending',
          createTime: dayjs().format('YYYY-MM-DD HH:mm')
        };

        const existingRequests = JSON.parse(localStorage.getItem('carRequests') || '[]');
        const updatedRequests = [...existingRequests, newRequest];
        localStorage.setItem('carRequests', JSON.stringify(updatedRequests));
        message.success('申请提交成功');
      }

      navigate('/request-list');
    } catch (error) {
      message.error(isEditMode ? '修改失败，请重试' : '提交失败，请重试');
    }
  };

  return (
    <div className="request-container">
      <Card 
        title={isEditMode ? "编辑申请" : "用车申请"} 
        className="request-card"
        extra={
          <Button type="link" onClick={() => navigate('/request-list')}>
            返回列表
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="request-form"
        >
          <div className="form-section">
            <Form.Item
              name="purpose"
              label="用车目的"
              rules={[{ required: true, message: '请输入用车目的' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="请详细描述用车目的"
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="destination"
              label="目的地"
              rules={[{ required: true, message: '请输入目的地' }]}
            >
              <Input 
                placeholder="请输入目的地"
                className="form-input"
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <Space className="time-range">
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <DatePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <DatePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm"
                  className="form-input"
                />
              </Form.Item>
            </Space>
          </div>

          <div className="form-section">
            <Form.Item
              name="passengers"
              label="乘车人员"
              rules={[{ required: true, message: '请输入乘车人员' }]}
            >
              <Input.TextArea 
                rows={2} 
                placeholder="请输入乘车人员姓名，多个人员用逗号分隔"
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="remarks"
              label="备注"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="其他补充说明（选填）"
                className="form-input"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="submit-button">
              {isEditMode ? '保存修改' : '提交申请'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CarRequest; 