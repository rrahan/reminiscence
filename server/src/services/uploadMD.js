const axios = require('axios')
const FormData = require('form-data')
const { nanoid } = require('nanoid')

const LMFILES_API_KEY = process.env.LMF_API_KEY

const uploadMD = async (markdownString) => {
    try {
        const fileName = `${nanoid(10)}.md`
        const fileBuffer = Buffer.from(markdownString, 'utf-8')
        const form = new FormData()
        form.append('file', fileBuffer, {
            filename: fileName,
            contentType: 'text/markdown'
        })

        const response = await axios.post('https://lmfiles.com/api/v1/files/upload', form, {
            headers: {
                ...form.getHeaders(),
                'X-API-Key': LMFILES_API_KEY
            }
        })
        return response.data
    } catch (e) {
        console.error('upload failed', e.message)
        throw e
    }

}

module.exports = uploadMD