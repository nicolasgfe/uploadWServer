import { Readable } from 'node:stream'
import { z } from 'zod'
import { db } from '../../infra/db'
import { schema } from '../../infra/db/schemas'
import { InvalidFileFormat } from './error/invalid-file-format'
import { type Either, makeLeft, makeRight } from '../../shared/either'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(
  input: UploadImageInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } = uploadImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat())
  }

  //todo caregar imagem para cloudFlare R2

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  })
  return makeRight({
    url: '',
  })
}
