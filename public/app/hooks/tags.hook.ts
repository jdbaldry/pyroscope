import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@phlare/redux/hooks';
import {
  fetchTags,
  selectRanges,
  selectQueries,
  selectAppTags,
} from '@phlare/redux/reducers/continuous';

// useTags handle loading tags when any of the following changes
// query, from, until
// Since the backend may have new tags given a new interval
export default function useTags() {
  const dispatch = useAppDispatch();
  const ranges = useAppSelector(selectRanges);
  const queries = useAppSelector(selectQueries);
  const { leftQuery, rightQuery, query } = queries;

  const regularTags = useAppSelector(selectAppTags(query));
  const leftTags = useAppSelector(selectAppTags(leftQuery));
  const rightTags = useAppSelector(selectAppTags(rightQuery));

  useEffect(() => {
    if (leftQuery) {
      dispatch(fetchTags(leftQuery));
    }
  }, [dispatch, leftQuery, ranges.left.from, ranges.right.until]);

  useEffect(() => {
    if (rightQuery) {
      dispatch(fetchTags(rightQuery));
    }
  }, [dispatch, rightQuery, ranges.right.from, ranges.right.until]);

  useEffect(() => {
    if (query) {
      dispatch(fetchTags(query));
    }
  }, [dispatch, query, ranges.regular.from, ranges.regular.until]);

  return {
    regularTags,
    leftTags,
    rightTags,
  };
}
