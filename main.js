changeTab("home")

function changeTab(id) {
    fetch("./cours/" + id + ".md")
    .then(res => res.text())
    .then(data => {
        let content = new RMark().render(data)
        console.log(content)
        document.getElementById("content").innerHTML = content
    })
}