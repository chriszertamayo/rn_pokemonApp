import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { storage } from "@/api/mmkv";
import { getPokemon, getPokemonDetail, Pokemon } from "@/api/pokeapi";
import { useQueries } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  Layout,
  LinearTransition,
  SlideOutLeft,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const Page = () => {
  const [keys, setKeys] = useState(storage.getAllKeys());
  const [data, setData] = useState<Pokemon[]>([]);

  const pokemonQueries = useQueries({
    queries: keys.map((key) => {
      const pokemonId = key.split("-")[1];
      return {
        queryKey: ["pokemon", pokemonId],
        queryFn: () => getPokemonDetail(pokemonId),
      };
    }),
  });

  const allFinished = pokemonQueries.every((q) => q.isSuccess);

  useEffect(() => {
    if (allFinished) {
      const newData = pokemonQueries.map((q) => q.data!);
      setData(newData);
    }
  }, [allFinished]);

  const removeFavorite = (id: number) => {
    storage.delete(`favorite-${id}`);
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView>
      {data.length > 0 &&
        data.map((item, index) => (
          <Animated.View
            key={item.id}
            style={styles.item}
            layout={LinearTransition.duration(100)}
            entering={FadeIn.delay(100 * index)}
            exiting={SlideOutLeft.duration(200)}
          >
            <Image
              source={{ uri: item.sprites.front_default }}
              style={styles.preview}
            />
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
              <Ionicons name="trash" size={18} color="#c10505" />
            </TouchableOpacity>
          </Animated.View>
        ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 18,
    textTransform: "capitalize",
    flex: 1,
  },
  preview: {
    width: 100,
    height: 100,
  },
});

export default Page;
