// 假设博客文件位于 blogs 目录中
const blogFiles = ["blog1.md", "blog2.md"]; // 添加你所有的博客文件名

document.addEventListener("DOMContentLoaded", () => {
    const blogList = document.getElementById("blogList");
    const blogContent = document.getElementById("blogContent");

    // 生成左侧导航栏
    blogFiles.forEach((file, index) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = `Blog ${index + 1}`;
        a.href = "#";
        a.addEventListener("click", () => loadBlog(file));
        li.appendChild(a);
        blogList.appendChild(li);
    });
});

function loadBlog(file) {
    fetch(`blogs/${file}`)
        .then(response => response.text())
        .then(content => {
            document.getElementById("blogContent").innerHTML = marked(content);
        })
        .catch(error => {
            document.getElementById("blogContent").innerHTML = "<p>Error loading blog.</p>";
            console.error("Error loading blog:", error);
        });
}
