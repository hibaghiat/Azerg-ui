import axios from 'axios'
axios.defaults.withCredentials = true

interface TagReq {
	tag_name: string
	tag_description?: string
}

export default class DataSender {
	static async activateUser(userId): Promise<any> {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/activate`,
			)
			return response
		} catch (error) {
			throw new Error('Failed to activate user')
		}
	}
	static async updateProfile(userID, data): Promise<any> {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/users/${userID}/profile`,
				data,
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to modify profile')
		}
	}

	static async registerUser(user): Promise<any> {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
				user,
			)
			return response
		} catch (error) {
			throw new Error('Failed to register user')
		}
	}

	static async updateUserLimits(userId, credits): Promise<any> {
		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/limits`,
				{
					credits: credits,
				},
			)
			return response
		} catch (error) {
			throw new Error('Failed to update user limits')
		}
	}

	static async sendVerification(email): Promise<any> {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/email`,
				{
					email,
				},
			)
			return response
		} catch (error) {
			throw new Error('Failed to send verification email')
		}
	}

	static async loginUser(username, password): Promise<any> {
		try {
			const response = axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				new URLSearchParams({
					username: username,
					password: password,
				}),
			)
			return response
		} catch (error) {
			throw new Error('Failed to login')
		}
	}
	static async logout(): Promise<any> {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to logout')
		}
	}

	static async validatePassword(userId, currentPassword) {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-password`,
				{
					current_password: currentPassword,
				},
			)
			return response.data
		} catch (error) {
			console.error('Error validating password:', error.message)
			throw error
		}
	}

	static async createTag(tagName: string, reportId: string): Promise<any> {
		try {
			const tag: TagReq = {
				tag_name: tagName,
				tag_description: '',
			}
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/tags/create?report_id=${reportId}`,
				tag,
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to create tag')
		}
	}

	static async updateTag(tagId: string, tag: TagReq): Promise<any> {
		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/tags/${tagId}`,
				tag,
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to update tag')
		}
	}

	static async deleteTagFromReport(
		tagId: string,
		reportId: string,
	): Promise<any> {
		try {
			const response = await axios.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/tags/${tagId}?report_id=${reportId}`,
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to delete tag from report')
		}
	}
}
