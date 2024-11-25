const { readFileSync, writeFile } = require("fs")
const dummyDataURL = "https://dummyjson.com/todos"
const dummyDataFile = "./dummyData.json"

const collectDummyData = () => {
	return fetch(dummyDataURL)
		.then((data) => data.json())
		.then((data) =>
			writeFile(dummyDataFile, JSON.stringify(data.todos), (err) => {
				if (err) console.log(err.message)
			})
		)
		.catch((err) => console.log(err.message))
}

collectDummyData()
