import fnmatch
import os

track_code = """
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-48664735-1', 'kylelk.github.io');
ga('send', 'pageview');

</script>
"""


matches = []
for root, dirnames, filenames in os.walk('.'):
  for filename in fnmatch.filter(filenames, '*.html'):
      matches.append(os.path.join(root, filename))

for file_name in matches:
    html_file=open(file_name, "r+")
    html_data = html_file.read()
    if "</head>" in html_data and not "UA-48664735-1" in html_data:
        print file_name
        html_data1=list(html_data)
        html_data1.insert(html_data.find("</head>"), track_code)
        html_file.write("".join(html_data1))
        html_file.close()
    
    elif "</HEAD>" in html_data and not "UA-48664735-1" in html_data:
        print file_name
        html_data1=list(html_data)
        html_data1.insert(html_data.find("</HEAD>"), track_code)
        html_file.write("".join(html_data1))
        html_file.close()
