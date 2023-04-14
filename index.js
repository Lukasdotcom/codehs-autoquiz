function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
async function main() {
	const csrf = getCookie("csrftoken")
  const attempt_id = window.pageSpecific.assignmentAttemptID;
	const json_data = prompt("Enter the result of running the program the first time. If this is the first time you are running it just press enter.");
  const data = json_data === "" ? {} : JSON.parse(json_data);
  console.log(data);
	const questions = Object.values(document.getElementsByClassName("check-answer-button")).map((e) => e.id.replaceAll("-button", "").replaceAll("check-", ""));
	let answer_dict = {};
  for (let i = 0; i < questions.length; i++) {
		let id = questions[i];
		let answer = "0";
		if (data[id]) {
			answer = data[id];
		}
		await fetch("https://codehs.com/quiz/ajax/track_quiz_answer", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRFToken": csrf,
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      "body": `attempt_id=${attempt_id}&question_id=${id}&answer_idx=${answer}&method=track_quiz_answer`,
      "method": "POST",
      "mode": "cors"
    });
    const response = await fetch("https://codehs.com/quiz/ajax/finalize_quiz_answer", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRFToken": csrf,
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "body": `attempt_id=${attempt_id}&question_id=${id}&method=finalize_quiz_answer`,
    "method": "POST",
    "mode": "cors"
});
		const result = await response.json();
    if (result.correctAnswer) {
			answer_dict[id] = String(result.correctAnswer);
    }
  }
  alert("You will get another alert. Copy the result of the alert, submit the exam and then retake it. Then run this program again and paste the stuff you copied from the previous running again.");
  alert(JSON.stringify(answer_dict));
}
main();
