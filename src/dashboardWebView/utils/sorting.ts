import { SortOrder, SortType, SortingSetting } from '../../models';
import { SortOption } from '../constants/SortOption';
import { NavigationType, Settings, SortingOption } from '../models';

const BASE_SORT_OPTIONS: SortingOption[] = [
  {
    name: SortOption.LastModifiedAsc,
    id: SortOption.LastModifiedAsc,
    order: SortOrder.asc,
    type: SortType.date
  },
  {
    name: SortOption.LastModifiedDesc,
    id: SortOption.LastModifiedDesc,
    order: SortOrder.desc,
    type: SortType.date
  },
  {
    name: SortOption.FileNameAsc,
    id: SortOption.FileNameAsc,
    order: SortOrder.asc,
    type: SortType.string
  },
  {
    name: SortOption.FileNameDesc,
    id: SortOption.FileNameDesc,
    order: SortOrder.desc,
    type: SortType.string
  }
];

const CONTENT_SORT_OPTIONS: SortingOption[] = [
  {
    name: SortOption.PublishedAsc,
    id: SortOption.PublishedAsc,
    order: SortOrder.asc,
    type: SortType.date
  },
  {
    name: SortOption.PublishedDesc,
    id: SortOption.PublishedDesc,
    order: SortOrder.desc,
    type: SortType.date
  }
];

const MEDIA_SORT_OPTIONS: SortingOption[] = [
  {
    name: SortOption.SizeAsc,
    id: SortOption.SizeAsc,
    order: SortOrder.asc,
    type: SortType.number
  },
  {
    name: SortOption.SizeDesc,
    id: SortOption.SizeDesc,
    order: SortOrder.desc,
    type: SortType.number
  },
  {
    name: SortOption.CaptionAsc,
    id: SortOption.CaptionAsc,
    order: SortOrder.asc,
    type: SortType.string
  },
  {
    name: SortOption.CaptionDesc,
    id: SortOption.CaptionDesc,
    order: SortOrder.desc,
    type: SortType.string
  },
  {
    name: SortOption.AltAsc,
    id: SortOption.AltAsc,
    order: SortOrder.asc,
    type: SortType.string
  },
  {
    name: SortOption.AltDesc,
    id: SortOption.AltDesc,
    order: SortOrder.desc,
    type: SortType.string
  }
];

export const getSortingOptions = (
  view: NavigationType,
  customSorting: SortingSetting[] | undefined,
  disableCustomSorting = false
) => {
  let options = [...BASE_SORT_OPTIONS];

  if (view === NavigationType.Media) {
    options = [...options, ...MEDIA_SORT_OPTIONS];
  } else if (view === NavigationType.Contents) {
    options = [...CONTENT_SORT_OPTIONS, ...options];
  }

  if (customSorting && !disableCustomSorting) {
    options = [
      ...options,
      ...customSorting.map((s) => ({
        title: s.title || s.name,
        name: s.name,
        id: s.id || `${s.name}-${s.order}`,
        order: s.order,
        type: s.type
      }))
    ];
  }

  return options;
};

export const resolveSortingOption = ({
  currentSorting,
  persistedSorting,
  settings,
  view,
  allOptions
}: {
  currentSorting: SortingOption | null | undefined;
  persistedSorting: SortingOption | null | undefined;
  settings: Settings | null;
  view: NavigationType;
  allOptions: SortingOption[];
}) => {
  let sorting = currentSorting || persistedSorting || null;

  if (sorting === null) {
    const defaultSortingId =
      view === NavigationType.Contents
        ? settings?.dashboardState.contents.defaults?.sorting ||
          settings?.dashboardState.contents.defaultSorting
        : settings?.dashboardState.media.defaultSorting;

    if (defaultSortingId) {
      sorting = allOptions.find((f) => f.id === defaultSortingId) || null;
    }
  }

  return sorting;
};
