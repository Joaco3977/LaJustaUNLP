import { useLocalSearchParams } from 'expo-router';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();

  console.log('Category ID:', id);

  return null;
}