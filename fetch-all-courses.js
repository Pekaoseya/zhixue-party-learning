const http = require('http');

const postData = new URLSearchParams({
  page: '1',
  rows: '1000',
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

const req = http.request('http://192.168.1.244:8082/api/Page/CourseList', {
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
      const listData = json.Data?.ListData || [];
      
      const keywords = ['党','党建','党史','党章','二十','廉政','纪检','乡村','基层',
        '群众','修养','纪律','治理','思想','理论','精神','马克思','革命',
        '统战','党风','作风','干部','先锋','党员','先锋','先锋','先锋',
        '先锋','先锋','先锋','先锋','先锋','先锋','先锋'];
      
      const partyCourses = listData.filter(c => {
        const title = (c.Name || c.Title || '');
        return keywords.some(kw => title.includes(kw));
      });
      
      console.log('Total courses:', listData.length);
      console.log('Party-related courses:', partyCourses.length);
      console.log('');
      console.log('=== ALL PARTY-RELATED COURSES ===');
      partyCourses.forEach((c, i) => {
        const num = String(i+1).padStart(3, '0');
        const name = c.Name || 'N/A';
        const id = c.Id || 'N/A';
        const time = c.Time || 0;
        const teacher = c.Teacher || '';
        console.log(`[${num}] ID:${id}  ${name} | ${time}h | ${teacher}`);
      });
      
      // Also output raw JSON for saving
      const fs = require('fs');
      fs.writeFileSync('backend-courses.json', JSON.stringify(partyCourses, null, 2));
      console.log('\nSaved to backend-courses.json');
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw data:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
});

req.write(postData);
req.end();
