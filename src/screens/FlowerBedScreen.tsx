import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Home, X } from 'lucide-react-native';
import { IS_COMPACT } from '../constants/config';
import { FLOWER_SPECIES, nextSpecies, unlockedCount } from '../constants/flowerSpecies';
import type { FlowerSpecies } from '../constants/flowerSpecies';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import FlowerCard from '../components/FlowerCard';
import FlowerGlyph from '../components/FlowerGlyph';
import GardenBackground from '../components/GardenBackground';
import PageControls from '../components/PageControls';
import RaisedPanel from '../components/RaisedPanel';
import ScreenHeader from '../components/ScreenHeader';

const PER_PAGE = 4;
const PAGE_COUNT = Math.ceil(FLOWER_SPECIES.length / PER_PAGE);

/** Flower Bed: lifetime collection, paged four species at a time. */
function FlowerBedScreen({ totalPetals, onBack }: { totalPetals: number; onBack: () => void }) {
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<FlowerSpecies | null>(null);

  const grown = unlockedCount(totalPetals);
  const next = nextSpecies(totalPetals);
  const slice = FLOWER_SPECIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const openDetail = useCallback((species: FlowerSpecies) => setDetail(species), []);

  const rows: FlowerSpecies[][] = [slice.slice(0, 2), slice.slice(2, 4)];

  return (
    <GardenBackground variant="support">
      <View style={styles.root}>
        <ScreenHeader
          title="Flower Bed"
          subtitle={grown + '/' + FLOWER_SPECIES.length + ' grown'}
          leftSlot={<SecondaryButton label="BACK" small onPress={onBack} accessibilityLabel="Go back" style={styles.back} />}
        />

        <View style={styles.body}>
          <RaisedPanel compact={IS_COMPACT} style={styles.progressCard}>
            <Text style={styles.progressValue}>{totalPetals + ' petals'}</Text>
            <Text style={styles.progressLabel} numberOfLines={2}>
              {next
                ? next.name + ' grows at ' + next.threshold + ' petals'
                : 'Flower bed complete'}
            </Text>
          </RaisedPanel>

          <View style={styles.grid}>
            {rows.map((row, r) =>
              row.length ? (
                <View style={styles.gridRow} key={'row' + r}>
                  {row.map(species => (
                    <FlowerCard
                      key={species.id}
                      species={species}
                      totalPetals={totalPetals}
                      unlocked={totalPetals >= species.threshold}
                      onPress={openDetail}
                    />
                  ))}
                  {row.length === 1 ? <View style={styles.spacerCard} /> : null}
                </View>
              ) : null,
            )}
          </View>

          <PageControls
            page={page}
            pageCount={PAGE_COUNT}
            onPrevious={() => setPage(p => Math.max(0, p - 1))}
            onNext={() => setPage(p => Math.min(PAGE_COUNT - 1, p + 1))}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="GARDEN GATE" Icon={Home} onPress={onBack} accessibilityLabel="Return to the garden gate" />
        </View>

        <Modal visible={!!detail} transparent animationType="fade" onRequestClose={() => setDetail(null)}>
          <View style={styles.backdrop}>
            <RaisedPanel style={styles.detailCard}>
              {detail ? (
                <View style={styles.detailInner}>
                  <FlowerGlyph species={detail} size={64} muted={totalPetals < detail.threshold} />
                  <Text style={styles.detailName}>{detail.name}</Text>
                  <Text style={styles.detailShape} numberOfLines={2}>
                    {detail.shape}
                  </Text>
                  <Text style={styles.detailStatus} numberOfLines={1}>
                    {totalPetals >= detail.threshold
                      ? 'Grown'
                      : Math.max(0, detail.threshold - totalPetals) + ' petals to grow'}
                  </Text>
                  <View style={styles.detailAction}>
                    <SecondaryButton label="CLOSE" Icon={X} onPress={() => setDetail(null)} accessibilityLabel="Close" />
                  </View>
                </View>
              ) : null}
            </RaisedPanel>
          </View>
        </Modal>
      </View>
    </GardenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 48 },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  progressCard: {
    width: '100%',
  },
  progressValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  progressLabel: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  grid: {
    marginVertical: 12,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 12,
  },
  spacerCard: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 34, 16, 0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  detailCard: {
    width: '100%',
    maxWidth: 340,
  },
  detailInner: {
    alignItems: 'center',
  },
  detailName: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  detailShape: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  detailStatus: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
  detailAction: {
    marginTop: 14,
    width: '100%',
  },
});

export default FlowerBedScreen;
