import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../db'
import { schema } from '../../db/schemas'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post('/uploads',{
		schema: {
			summary: "Upload as image",
			body: z.object({
				name: z.string(),
				password: z.string().optional()
			}),
			response: {
				201: z.object({ uploadId: z.string()}),
				400: z.object({ message: z.string()}).describe("Upload already exists."),
			}
		} 
	}, async (request, reply) => {

		await db.insert(schema.uploads).values({
			name: "test.jpg",
			remoteKey: "teste.jpg",
			remoteUrl: "http://asasfdas.com"
		})

    return reply.status(201).send({ uploadId: "test"})
  })
}
