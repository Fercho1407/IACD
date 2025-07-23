fetch('/members.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('members').innerHTML = data;

    fetch('/collaborators.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('collaborators').innerHTML = data;
      });
  });