import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getPokemonDetail, Pokemon } from "@/api/pokeapi";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { storage } from "@/api/mmkv";
import Animated, {
  FadeIn,
  FadeInDown,
  FlipInEasyX,
} from "react-native-reanimated";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    storage.getString(`favorite-${id}`) === "true"
  );

  const { data } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => getPokemonDetail(id!),
    refetchOnMount: false,
  });

  useEffect(() => {
    const load = async () => {
      navigation.setOptions({
        title: data!.name.charAt(0).toUpperCase() + data!.name.slice(1),
      });
    };

    load();
  }, [data?.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={22}
            color="#fff"
          />
        </Text>
      ),
    });
  }, [isFavorite]);

  const toggleFavorite = async () => {
    storage.set(`favorite-${id}`, !isFavorite ? "true" : "false");
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={{ padding: 10 }}>
      {data && (
        <>
          <Animated.View
            style={[styles.card, { alignItems: "center" }]}
            entering={FadeIn.delay(200)}
          >
            <Image
              source={{ uri: data.sprites.front_default }}
              style={{ width: 200, height: 200 }}
            />
            <Animated.Text
              style={styles.name}
              entering={FlipInEasyX.delay(300)}
            >
              #{data.id} {data.name}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={styles.card} entering={FadeInDown.delay(500)}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Stats:</Text>
            {data.stats.map((item: any) => (
              <Text key={item.stat.name}>
                {item.stat.name}: {item.base_stat}
              </Text>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    elevation: 1,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

export default Page;
