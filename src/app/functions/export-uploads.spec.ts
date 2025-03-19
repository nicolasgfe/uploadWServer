import { rejects } from 'node:assert'
import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { makeUpload } from '../../../test/factories/make-upload'
import { exportUploads } from './export-uploads'
import { isRight, unwrapEither } from '@/shared/either'
import exp from 'node:constants'

describe('export uploads', () => {
  it('should be able to get the uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://exemple.com/file.csv',
        }
      })

    const namePater = randomUUID()

    const upload1 = await makeUpload({ name: `${namePater}.webp` })
    const upload2 = await makeUpload({ name: `${namePater}.webp` })
    const upload3 = await makeUpload({ name: `${namePater}.webp` })
    const upload4 = await makeUpload({ name: `${namePater}.webp` })
    const upload5 = await makeUpload({ name: `${namePater}.webp` })

    const sut = await exportUploads({
      searchQuery: namePater,
    })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chucks: Buffer[] = []

      generatedCSVStream.on('data', (chuck: Buffer) => {
        chucks.push(chuck)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chucks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'http://exemple.com/file.csv',
    })
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded_at'],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
      [upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
      [upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)],
    ])
  })
})
