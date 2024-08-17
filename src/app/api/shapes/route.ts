import { NextRequest, NextResponse } from 'next/server'
import { promises } from 'fs'
import JSZip from 'jszip'
import { DOMParser } from 'xmldom'
import * as toGeojson from '@tmcw/togeojson'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  //handle zip
  const zip = new JSZip()
  const text = file.arrayBuffer()
  await zip.loadAsync(text)
  const zippedFiles = Object.entries(zip.files)
    .filter(([name, fileObject]) => name.endsWith('.kml'))
    .map((pair) => pair[1])

  if (zippedFiles.length > 1) {
    NextResponse.json({ error: 'Zipfile contained too many kmls.' }, { status: 400 })
  }
  const kml = await streamToString(zippedFiles[0].nodeStream())

  //extract geojson
  const doc = new DOMParser().parseFromString(kml)
  const geojson = toGeojson.kml(doc)

  return NextResponse.json({ shapes: geojson })
}

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
