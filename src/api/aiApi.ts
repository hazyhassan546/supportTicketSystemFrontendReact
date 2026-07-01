import axiosInstance from './axiosInstance'

type ImproveDescriptionResponse = { data: { description: string } }

const aiApi = {
  improveDescription: (description: string) =>
    axiosInstance.post<ImproveDescriptionResponse>('/ai/improve-description', {
      description,
    }),
}

export default aiApi
