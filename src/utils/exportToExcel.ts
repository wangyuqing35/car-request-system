import * as XLSX from 'xlsx';
import { Request } from '../types';

export const exportToExcel = (requests: Request[]) => {
  // 准备数据
  const data = requests.map(request => ({
    '申请编号': request.id,
    '用车目的': request.purpose,
    '目的地': request.destination,
    '开始时间': request.startTime,
    '结束时间': request.endTime,
    '乘车人员': request.passengers,
    '备注': request.remarks || '',
    '状态': request.status,
    '创建时间': request.createTime
  }));

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // 设置列宽
  const colWidths = [
    { wch: 10 }, // 申请编号
    { wch: 20 }, // 用车目的
    { wch: 20 }, // 目的地
    { wch: 20 }, // 开始时间
    { wch: 20 }, // 结束时间
    { wch: 30 }, // 乘车人员
    { wch: 30 }, // 备注
    { wch: 10 }, // 状态
    { wch: 20 }  // 创建时间
  ];
  ws['!cols'] = colWidths;

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '用车申请记录');

  // 导出文件
  XLSX.writeFile(wb, '用车申请记录.xlsx');
}; 