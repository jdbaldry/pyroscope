import React, { useMemo } from 'react';
import { TimelineGroupData } from '@phlare/components/TimelineChart/TimelineChartWrapper';
import { getFormatter } from '@pyroscope/flamegraph/src/format/format';
import { Profile } from '@pyroscope/models/src';
import LoadingSpinner from '@phlare/ui/LoadingSpinner';
import PieChart, { PieChartDataItem } from './PieChart';
import PieChartTooltip from './PieChartTooltip';
import { calculateTotal } from '../../../math';
import { formatValue } from '../../../formatTableData';
import styles from './index.module.scss';

interface TotalSamplesChartProps {
  filteredGroupsData: TimelineGroupData[];
  profile?: Profile;
  formatter?: ReturnType<typeof getFormatter>;
  isLoading: boolean;
}

const CHART_HEIGT = '280px';
const CHART_WIDTH = '280px';

const TotalSamplesChart = ({
  filteredGroupsData,
  formatter,
  profile,
  isLoading,
}: TotalSamplesChartProps) => {
  const pieChartData: PieChartDataItem[] = useMemo(() => {
    return filteredGroupsData.length
      ? filteredGroupsData.map((d) => ({
          label: d.tagName,
          data: calculateTotal(d.data.samples),
          color: d.color,
        }))
      : [];
  }, [filteredGroupsData]);

  if (!pieChartData.length || isLoading) {
    return (
      <div
        style={{ width: CHART_WIDTH, height: CHART_HEIGT }}
        className={styles.chartSkeleton}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PieChart
      data={pieChartData}
      id="total-samples-chart"
      height={CHART_HEIGT}
      width={CHART_WIDTH}
      onHoverTooltip={(data) => (
        <PieChartTooltip
          label={data.label}
          value={formatValue({ formatter, profile, value: data.value })}
          percent={data.percent}
        />
      )}
    />
  );
};

export default TotalSamplesChart;
