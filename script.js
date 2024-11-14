const repository = "Ardentlyer/docs";  // 替换为你的 GitHub 用户名和仓库名
const blogDirectory = "posts";  // 存放博客文件的目录

document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");

    // 从 GitHub API 获取博客文件列表
    fetch(`https://api.github.com/repos/${repository}/contents/${blogDirectory}`)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.type === "file" && file.name.endsWith(".md")) {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = "#";
                    a.textContent = file.name.replace(".md", "");  // 显示去除 `.md` 后缀的文件名
                    a.addEventListener("click", () => loadPost(file.path));
                    li.appendChild(a);
                    postList.appendChild(li);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching blog files:", error);
            document.getElementById("content").innerHTML = "<p>Error loading posts.</p>";
        });
});

// 加载博客内容
function loadPost(filePath) {
    fetch(`https://raw.githubusercontent.com/${repository}/main/${filePath}`)
        .then(response => response.text())
        .then(markdown => {
            document.getElementById("content").innerHTML = marked(markdown);
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Error loading post.</p>";
            console.error("Error loading post:", error);
        });
}
