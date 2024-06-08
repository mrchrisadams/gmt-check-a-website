
// edit this with the email address to be notified when the repo you submit is run
// see the full API at https://api.green-coding.io/docs

const gmtRunData = {
    name: "DjangoCon Europe 2024 Sprint Experiment",
    email: "chris@greenweb.org",
    url: "https://github.com/mrchrisadams/gmt-check-a-website",
    branch: "main",
    filename: "usage_scenario.yml",
    machine_id: 7,  // 7 is the specific machine ID for CO2 Benchmarking
    schedule_mode: "one-off",
}

// post the payload to add this repo to the GMT measurement cluster for a one - off run
const result = await fetch("https://api.green-coding.io/v1/software/add", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gmtRunData)
})
console.log(await result.json())
