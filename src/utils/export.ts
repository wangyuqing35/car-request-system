interface ExportData {
  id: string;
  purpose: string;
  destination: string;
  startTime: string;
  endTime: string;
  passengers: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
  remarks?: string;
}

interface WorksheetRow {
  '申请编号': string;
  '用车目的': string;
  '目的地': string;
  '开始时间': string;
  '结束时间': string;
  '乘车人员': string;
  '状态': string;
  '申请时间': string;
  '备注': string;
}

export const exportToExcel = (data: ExportData[], filename: string) => {
  // 创建工作表数据
  const worksheet: WorksheetRow[] = data.map(item => ({
    '申请编号': item.id,
    '用车目的': item.purpose,
    '目的地': item.destination,
    '开始时间': item.startTime,
    '结束时间': item.endTime,
    '乘车人员': item.passengers,
    '状态': item.status === 'pending' ? '待审批' : 
            item.status === 'approved' ? '已通过' : '已拒绝',
    '申请时间': item.createTime,
    '备注': item.remarks || ''
  }));

  // 创建 CSV 内容
  const headers = Object.keys(worksheet[0]) as Array<keyof WorksheetRow>;
  const csvContent = [
    headers.join(','),
    ...worksheet.map(row => 
      headers.map(header => {
        const value = row[header];
        // 处理包含逗号的值
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // 创建 Blob 对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 