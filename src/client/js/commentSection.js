const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementsByClassName("video__deleteBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "video__deleteBtn";
  span2.addEventListener("click", deleteComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const deleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const comment = event.target.parentNode;
  const commentId = comment.dataset.id;
  console.log(comment);
  console.log(commentId);
  comment.remove();
  const response = await fetch(`/api/videos/${videoId}/deleteComment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
};

function init() {
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
  if (deleteBtn[0]) {
    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener("click", deleteComment);
    }
  }
}

init();
