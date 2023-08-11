const languageSelect = document.getElementById("language");
const selectedLanguage = document.getElementById("selectedLanguage");

languageSelect.addEventListener("change", function () {
	const selectedOption = languageSelect.options[languageSelect.selectedIndex];
	selectedLanguage.textContent = selectedOption.text;
});
