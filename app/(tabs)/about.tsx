import { useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { NewsCard } from '@/components/news-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useNews } from '@/hooks/use-news';

/* ===== TEXTO ESTÁTICO DE PRESENTACIÓN ===== */
// Cada ítem tiene una palabra/frase en negrita y el resto del párrafo.
const PRESENTATION = [
  {
    keyword: 'LA JUSTA ES',
    text: ' una comercializadora que, desde la Universidad Nacional de La Plata, y en Red con organizaciones sociales, comunitarias, políticas y culturales, busca generar nuevos circuitos comerciales cortos para la economía social y solidaria, que promocionen un compre de proximidad de alimentos y otros bienes elaborados artesanalmente por cooperativas, agricultores familiares y pequeños productores de la economía popular, en pos de facilitar el acceso a los productos de este sector, intermediando solidariamente entre el consumo y la producción local.',
  },
  {
    keyword: 'NOS MUEVE',
    text: ' caminar hacia modos de producción, distribución, comercialización y consumo más sustentables y más justos, sin explotaciones sociales ni ambientales, que transiten la agroecología, ofrezcan alimentos saludables, con precios justos, con igualdad de género, con desarrollo desde lo local, con soberanía alimentaria, con organización y participación colectiva. Una economía social que garantice la reproducción de la vida de todxs.',
  },
  {
    keyword: 'ACERCAMOS',
    text: ' la producción local y regional realizada con trabajo cooperativo, familiar, autogestivo, asociativo, y acompañada por equipos de la Universidad Nacional de La Plata.',
  },
  {
    keyword: 'CONSTRUIMOS',
    text: ' un consumo consciente, responsable, reflexivo respecto de las condiciones sociales y ambientales en las que se han producido esos bienes y servicios que se consumen, el tipo de producción que sostiene, las relaciones de trabajo y de intercambio que promueve; un consumo activado colectivamente, organizado, para que pueda expandirse y sostenerse a la producción alternativa.',
  },
  {
    keyword: 'HACEMOS',
    text: ' una intermediación solidaria, brindando un servicio de logística, acopio, distribución, entrega, comunicación, activación de nodos de consumo, formación-capacitación, y apoyo a la producción desde distintos perfiles interdisciplinarios de equipos de la UNLP con experiencia en acompañamiento de la agricultura familiar y la economía social. Promovemos precios justos y transparentes. La comercialización alternativa que desarrollamos no persigue el lucro, la maximización de la ganancia, sino como en todo proceso cooperativo, retribuir en forma justa el trabajo implicado y sostener y mejorar sus condiciones de existencia. Luego de cubrir los gastos y el trabajo, pueden generarse excedentes, que se reinvierten en mejorar las condiciones de producción-reproducción.',
  },
];

/* ===== PAGINACIÓN ===== */
const PAGE_SIZE = 10;

export default function AboutScreen() {
  // theme = colores del tema activo (claro/oscuro), para la card de presentación.
  const theme = Colors[useColorScheme() ?? 'light'];
  const [page, setPage] = useState(0);
  const { news, total, loading, error, refetch } = useNews(page, PAGE_SIZE);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  // Rango visible para mostrar "1 - 10 de 12", igual que la web.
  const from = page * PAGE_SIZE + 1;
  const to = Math.min(from + PAGE_SIZE - 1, total);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ===== SECCIÓN PRESENTACIÓN (estática) ===== */}
        <View
          style={[
            styles.presentationCard,
            { backgroundColor: theme.card, borderColor: theme.detailBackground },
          ]}
        >
          <ThemedText color="title" style={styles.presentationTitle}>
            PRESENTACIÓN
          </ThemedText>
          <View style={[styles.titleUnderline, { backgroundColor: theme.tint }]} />

          {PRESENTATION.map((item, i) => (
            <ThemedText key={i} style={styles.paragraph}>
              <ThemedText style={styles.keyword}>{item.keyword}</ThemedText>
              {item.text}
            </ThemedText>
          ))}
        </View>

        {/* ===== SECCIÓN PRENSA (dinámica) ===== */}
        <ThemedText color="title" style={styles.sectionTitle}>
          PRENSA
        </ThemedText>

        {/* Contador "1 - 10 de 12" */}
        {!loading && !error && total > 0 && (
          <ThemedText color="subtext" style={styles.count}>
            {from} - {to} de {total}
          </ThemedText>
        )}

        {/* ESTADOS */}
        {loading ? (
          <ThemedText color="subtext" style={styles.message}>Cargando noticias...</ThemedText>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText color="subtext" style={styles.message}>
              No se pudieron cargar las noticias.
            </ThemedText>
            <AnimatedButton title="Reintentar" onPress={refetch} />
          </View>
        ) : news.length === 0 ? (
          <ThemedText color="subtext" style={styles.message}>No hay noticias para mostrar</ThemedText>
        ) : (
          news.map((item) => <NewsCard key={item.id} item={item} />)
        )}

        {/* PAGINACIÓN */}
        {!loading && !error && totalPages > 1 && (
          <View style={styles.pagination}>
            <AnimatedButton
              title="Anterior"
              onPress={() => setPage(page - 1)}
              disabled={!hasPrev}
            />

            <ThemedText color="subtext" style={styles.pageText}>
              Página {page + 1} de {totalPages}
            </ThemedText>

            <AnimatedButton
              title="Siguiente"
              onPress={() => setPage(page + 1)}
              disabled={!hasNext}
            />
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },

  /* PRESENTACIÓN */
  presentationCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    // sombra igual que las cards (product-card / producer-card)
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  presentationTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    marginBottom: 20,
    borderRadius: 2,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  keyword: {
    fontWeight: '800',
    fontSize: 16,
  },

  /* PRENSA */
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'right',
  },

  /* ESTADOS */
  message: {
    textAlign: 'center',
    marginTop: 20,
  },
  center: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },

  /* PAGINACIÓN */
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  pageText: {
    fontSize: 14,
  },
});
