// pages/form.js
import { useState } from 'react';

export default function FormPage() {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`项目名称: ${projectName}\n项目启动时间: ${startDate}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>项目表单</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="projectName">项目名称:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="startDate">项目启动时间:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  );
}
