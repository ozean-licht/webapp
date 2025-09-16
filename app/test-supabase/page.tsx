'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Test der Supabase-Verbindung
    const testConnection = async () => {
      try {
        // Einfache Abfrage um die Verbindung zu testen
        const { data, error } = await supabase.auth.getUser()

        if (error && error.message !== 'Auth session missing!') {
          throw error
        }

        setConnectionStatus('connected')
        setUser(data.user)
      } catch (error) {
        console.error('Supabase connection error:', error)
        setConnectionStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Supabase Connection Test
        </h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm">
              Status: {
                connectionStatus === 'connected' ? '✅ Verbunden' :
                connectionStatus === 'error' ? '❌ Fehler' : '⏳ Lädt...'
              }
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Supabase URL:</strong> https://suwevnhwtmcazjugfmps.supabase.co</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>

          {user && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm"><strong>Benutzer:</strong> {user.email}</p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Nächste Schritte:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Erstelle Tabellen in Supabase Dashboard</li>
              <li>• Verwende <code>supabase.from('table')</code> für Datenbankabfragen</li>
              <li>• Implementiere Auth mit <code>supabase.auth</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
