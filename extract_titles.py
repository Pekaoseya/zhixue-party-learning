import os
import re

# 扫描政治理论和统战理论目录
dirs = [r'E:\社院课程stt\政治理论', r'E:\社院课程stt\统战理论']
exclude_patterns = ['明镜', '点点栏目', '不吝点赞', '订阅', '打赏', '优优独播', 'YoYo', '李宗盛', '杨茜茜', '字幕志愿者', '正经州', '中文字幕']

for d in dirs:
    print(f'\n=== {os.path.basename(d)} ===')
    mp4_files = sorted([f for f in os.listdir(d) if f.endswith('.mp4')])
    print(f'共 {len(mp4_files)} 个视频文件')
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
                        if i > 30:
                            break
                # 合并文本
                text = ' '.join(lines)
                # 排除水印广告
                for pat in exclude_patterns:
                    text = text.replace(pat, '')
                # 清理非中文字符（保留标点）
                cleaned = re.sub(r'[^\u4e00-\u9fff，。！？、；：""''（）【】《》]', '', text)
                # 找前200字内的第一个完整句子
                sentences = re.split(r'[。！？]', cleaned[:200])
                for s in sentences:
                    s = s.strip()
                    if len(s) > 10 and len(s) < 60:
                        title = s
                        break
            except Exception as e:
                pass
        print(f'  {name:30s} -> {title}')
