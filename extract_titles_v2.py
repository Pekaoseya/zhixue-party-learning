import os
import re
import json

dirs = [r'E:\社院课程stt\政治理论', r'E:\社院课程stt\统战理论']
exclude_patterns = ['明镜', '点点栏目', '不吝点赞', '订阅', '打赏', '优优独播', 'YoYo', '李宗盛', '杨茜茜', '字幕志愿者', '正经州', '中文字幕', '字幕组', '志愿者']

# 存储提取结果
results = []

for d in dirs:
    category = os.path.basename(d)
    mp4_files = sorted([f for f in os.listdir(d) if f.endswith('.mp4')])
    for f in mp4_files:
        name = f[:-4]
        srt_path = os.path.join(d, f[:-4] + '.srt')
        title = ''
        if os.path.exists(srt_path):
            try:
                with open(srt_path, 'r', encoding='utf-8-sig') as sf:
                    lines = []
                    for i, line in enumerate(sf):
                        lines.append(line.strip())
                        if i > 50:
                            break
                text = ' '.join(lines)
                for pat in exclude_patterns:
                    text = text.replace(pat, '')
                cleaned = re.sub(r'[^\u4e00-\u9fff，。！？、；：""''（）【】《》\u3000-\u303f\uff00-\uffef]', '', text)
                sentences = re.split(r'[。！？]', cleaned[:300])
                for s in sentences:
                    s = s.strip()
                    if len(s) > 10 and len(s) < 80:
                        # 过滤掉口语化开头
                        s = re.sub(r'^(大家好|同志们好|各位好|各位|同志们|现在|今天我们|我们这一|我讲的|这一讲|围绕|坚持|贯彻|落实|落实|围绕|关于|今天给)', '', s)
                        s = s.strip()
                        if len(s) > 8 and len(s) < 60:
                            title = s
                            break
            except Exception as e:
                pass
        results.append({
            'category': category,
            'filename': name,
            'title': title
        })

# 输出有标题的课程
with_titled = [r for r in results if r['title']]
print(f'总共 {len(results)} 个视频，提取到 {len(with_titled)} 个标题')
print('='*80)
for r in with_titled:
    print(f"[{r['category']:6s}] {r['filename']:30s} -> {r['title']}")

# 保存为JSON供后续使用
with open('d:\\TraeProject\\zhixue-party-learning\\course_titles.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
