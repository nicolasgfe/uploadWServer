import { randomUUID } from 'node:crypto'
import { isRight, unwrapEither } from '@/shared/either'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { makeUpload } from '../../../test/factories/maku-upload'
import { getUploads } from './get-uploads'

describe('get uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePater = randomUUID()
    const upload1 = await makeUpload({ name: `${namePater}.webp` })
    const upload2 = await makeUpload({ name: `${namePater}.webp` })
    const upload3 = await makeUpload({ name: `${namePater}.webp` })
    const upload4 = await makeUpload({ name: `${namePater}.webp` })
    const upload5 = await makeUpload({ name: `${namePater}.webp` })

    const sut = await getUploads({
      searchQuery: namePater,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get pagination uploads', async () => {
    const namePater = randomUUID()
    const upload1 = await makeUpload({ name: `${namePater}.webp` })
    const upload2 = await makeUpload({ name: `${namePater}.webp` })
    const upload3 = await makeUpload({ name: `${namePater}.webp` })
    const upload4 = await makeUpload({ name: `${namePater}.webp` })
    const upload5 = await makeUpload({ name: `${namePater}.webp` })

    let sut = await getUploads({
      searchQuery: namePater,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePater,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get sorted uploads', async () => {
    const namePater = randomUUID()
    const upload1 = await makeUpload({
      createdAt: new Date(),
      name: `${namePater}.webp`,
    })
    const upload2 = await makeUpload({
      createdAt: dayjs().subtract(1, 'days').toDate(),
      name: `${namePater}.webp`,
    })
    const upload3 = await makeUpload({
      createdAt: dayjs().subtract(2, 'days').toDate(),
      name: `${namePater}.webp`,
    })
    const upload4 = await makeUpload({
      createdAt: dayjs().subtract(3, 'days').toDate(),
      name: `${namePater}.webp`,
    })
    const upload5 = await makeUpload({
      createdAt: dayjs().subtract(4, 'days').toDate(),
      name: `${namePater}.webp`,
    })

    let sut = await getUploads({
      searchQuery: namePater,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ])

    sut = await getUploads({
      searchQuery: namePater,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })
})
