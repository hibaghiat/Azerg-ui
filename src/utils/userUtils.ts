import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';

export class UserUtils {

    static async getUserId(token: string) {
        try {
            const decoded = jwtDecode(token);
            const userId = decoded["user_id"];
            return userId;
        } catch (error) {
            console.error('Failed to get user:', error);
            return null;
        }
    }
}