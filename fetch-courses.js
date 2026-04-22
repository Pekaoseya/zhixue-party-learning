const https = require('https');
const http = require('http');

const url = 'http://test10.jy365.net/api/Page/CourseList';
const postData = new URLSearchParams({
  page: '1',
  rows: '500',
  sort: 'Sort',
  order: 'desc',
  courseType: 'All',
  channelId: '',
  channelCode: '',
  title: '',
  titleNav: '课程中心',
  wordLimt: '35',
  teacher: '',
  TagId: '',
  channelIds: ''
}).toString();

const req = http.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const courses = json.Data || json.data || json.Rows || json.rows || json;
      
      if (Array.isArray(courses)) {
        console.log(`\n========== 后端课程列表 (共 ${courses.length} 门课程) ==========\n`);
        courses.forEach((c, i) => {
          const id = c.Id || c.id || c.CourseId || c.courseId || c.ID || '';
          const title = c.Title || c.title || c.CourseName || c.courseName || c.Name || c.name || '';
          const type = c.Type || c.type || c.CourseType || '';
          const cat = c.Category || c.category || c.ChannelName || c.channelName || c.ChannelCode || c.channelCode || '';
          console.log(`${(i+1).toString().padStart(3)}. [ID: ${id}] ${title} | 类型: ${type} | 分类: ${cat}`);
        });
        console.log('\n========== 结束 ==========\n');
      } else {
        console.log('Response Data (non-array):', JSON.stringify(json, null, 2).substring(0, 2000));
      }
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 2000));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();
