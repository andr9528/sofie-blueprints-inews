// this converts a snapshot into importable rundown data
// use with `node convert.js snapshot.json [output-rundown.json]`
if (process.argv.length < 3) {
    console.log(process.argv)
    console.log(`Usage: node convert.js snapshot.json [output-rundown.json]`)
    process.exit(0)
}
const fs = require('fs')
// const path = require('path')
const snapshot = JSON.parse(fs.readFileSync(process.argv[2])).ingestData
const rundownData = snapshot.filter(e => e.type === 'rundown')
const segmentData = snapshot.filter(e => e.type === 'segment')
const partData = snapshot.filter(e => e.type === 'part')
if (rundownData.length !== 1) {
    console.error(`Got ${rundownData.length} rundown ingest data. Can't continue`)
    return
}
segmentData.forEach(seg => {
    let parts = partData.filter(e => e.segmentId === seg.segmentId)
    parts = parts.map(e => e.data)
    parts = parts.sort((a, b) => b.rank - a.rank)
    seg.data.parts = parts
})
let segments = segmentData.map(s => s.data)
segments = segments.sort((a, b) => b.rank - a.rank)
const rundown = rundownData[0].data
rundown.segments = segments
// console.log(JSON.stringify(rundown, undefined, 4))
let outputString = 'converted-rundown.json';
const outputArgument = process.argv[3];
if (outputArgument !== undefined && outputArgument !== '') {
    outputString = outputArgument;
}
fs.writeFileSync(outputString, JSON.stringify(rundown, undefined, 4))
console.log('done')