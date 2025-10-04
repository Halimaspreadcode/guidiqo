'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@stackframe/stack'

interface UserProfile {
  id: string
  stackId: string
  email: string
  name: string | null
  profileImage: string | null
  role: string
  createdAt: string
  updatedAt: string
}

export function useUserProfile() {
  const stackUser = useUser({ or: 'return-null' })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger le profil depuis la DB
  useEffect(() => {
    const loadProfile = async () => {
      if (!stackUser?.id) {
        setLoading(false)
        return
      }

      try {
        // D'abord, s'assurer que l'utilisateur existe dans la DB
        await syncUserWithDB()

        // Ensuite, charger le profil
        const response = await fetch(`/api/user/profile?stackId=${stackUser.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
        } else {
          throw new Error('Erreur lors du chargement du profil')
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [stackUser?.id])

  // Synchroniser l'utilisateur Stack Auth avec la DB
  const syncUserWithDB = async () => {
    if (!stackUser?.id || !stackUser.primaryEmail) return

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stackId: stackUser.id,
          email: stackUser.primaryEmail,
          name: stackUser.displayName || stackUser.primaryEmail.split('@')[0],
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de synchronisation')
      }
    } catch (err) {
      console.error('Erreur sync user:', err)
    }
  }

  // Mettre à jour le profil
  const updateProfile = async (data: { profileImage?: string | null; name?: string }) => {
    if (!stackUser?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stackId: stackUser.id,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de mise à jour')
      }

      const result = await response.json()
      setProfile(result.user)
      
      return result.user
    } catch (err) {
      console.error('Erreur update profile:', err)
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    stackUser,
  }
}
