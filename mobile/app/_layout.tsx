
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    // add this
    <QueryClientProvider client={queryClient}>
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
        name='index'
        options={{
          headerTitle: "Patient Queue 🏥"
        }}
        />
        <Stack.Screen
        name='triage/index'
        options={{
          headerTitle:"🚑 Questions 🚑",
          presentation:"modal"
        }}
        />
      </Stack>
      </ThemeProvider>
    </TamaguiProvider>
    </QueryClientProvider>
  )
}