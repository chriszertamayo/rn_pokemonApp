import React from "react";
import { Link, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient({});

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerTitleAlign: "center",
            headerRight: () => (
              <Link href="/favorites" asChild>
                <Ionicons name="heart-circle" size={26} color="#fff" />
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="(pokemon)/[id]"
          options={{ title: "Pokemon", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="favorites"
          options={{ title: "Favorites", presentation: "modal" }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default Layout;
