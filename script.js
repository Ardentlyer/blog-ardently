const repository = "Ardentlyer/blog";  // 使用你的 GitHub 用户名和仓库名
const blogDirectory = "posts";  // 顶级目录，假设是 posts

document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");

    // 获取顶级 posts 目录下的所有文件和子目录
    fetch(`https://api.github.com/repos/${repository}/contents/${blogDirectory}`)
        .then(response => response.json())
        .then(contents => {
            // 过滤出子目录
            const directories = contents.filter(item => item.type === "dir").map(item => item.path);
            
            // 使用 Promise.all 获取每个子目录中的文件
            Promise.all(directories.map(directory => fetchBlogFiles(directory)))
                .then(allFiles => {
                    // 合并所有子目录中的文件
                    const mergedFiles = [].concat(...allFiles);

                    // 根据合并后的文件列表创建博客链接
                    mergedFiles.forEach(file => {
                        const li = document.createElement("li");
                        const a = document.createElement("a");
                        a.href = "#";
                        a.textContent = file.name.replace(".md", "");  // 去除 `.md` 后缀
                        a.addEventListener("click", () => loadPost(file.path));
                        li.appendChild(a);
                        postList.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error("Error fetching blog files:", error);
                    document.getElementById("content").innerHTML = "<p>Error loading posts.</p>";
                });
        })
        .catch(error => {
            console.error("Error fetching directories:", error);
            document.getElementById("content").innerHTML = "<p>Error loading directories.</p>";
        });
});

// 获取某个目录下的文件
function fetchBlogFiles(directory) {
    return fetch(`https://api.github.com/repos/${repository}/contents/${directory}`)
        .then(response => response.json())
        .then(files => {
            return files.filter(file => file.type === "file" && file.name.endsWith(".md"));
        })
        .catch(error => {
            console.error(`Error fetching files from ${directory}:`, error);
            return [];
        });
}

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
