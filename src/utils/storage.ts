import { Course } from '../types';
import { INITIAL_SAMPLE_COURSE, getFullWeeksForCourse } from '../constants/sampleData';

const CURRENT_COURSE_KEY = 'instructional_designer_current_course_id';
const COURSES_LIST_KEY = 'instructional_designer_courses_index';

// Initialize default sample course if storage is empty
export function initStorage(): Course {
  try {
    const currentId = localStorage.getItem(CURRENT_COURSE_KEY);
    const savedCoursesIndex = localStorage.getItem(COURSES_LIST_KEY);

    if (currentId && savedCoursesIndex) {
      const courseData = localStorage.getItem(`course_${currentId}`);
      if (courseData) {
        return JSON.parse(courseData);
      }
    }

    // Default setup
    const initialCourse: Course = {
      ...INITIAL_SAMPLE_COURSE,
      weeks: getFullWeeksForCourse(INITIAL_SAMPLE_COURSE.totalWeeks, INITIAL_SAMPLE_COURSE.weeks),
    };

    saveCourse(initialCourse);
    localStorage.setItem(CURRENT_COURSE_KEY, initialCourse.id);
    localStorage.setItem(COURSES_LIST_KEY, JSON.stringify([{ id: initialCourse.id, name: initialCourse.name }]));

    return initialCourse;
  } catch (err) {
    console.error('Storage init failed, using fallback:', err);
    return INITIAL_SAMPLE_COURSE;
  }
}

export function saveCourse(course: Course): void {
  try {
    const updated = {
      ...course,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`course_${course.id}`, JSON.stringify(updated));

    // Update index
    const indexStr = localStorage.getItem(COURSES_LIST_KEY);
    let index: Array<{ id: string; name: string }> = indexStr ? JSON.parse(indexStr) : [];
    const existingIdx = index.findIndex((item) => item.id === course.id);
    if (existingIdx >= 0) {
      index[existingIdx].name = course.name;
    } else {
      index.push({ id: course.id, name: course.name });
    }
    localStorage.setItem(COURSES_LIST_KEY, JSON.stringify(index));
  } catch (err) {
    console.error('Failed to save course to localStorage:', err);
  }
}

export function getSavedCoursesList(): Array<{ id: string; name: string }> {
  try {
    const indexStr = localStorage.getItem(COURSES_LIST_KEY);
    return indexStr ? JSON.parse(indexStr) : [];
  } catch (err) {
    return [];
  }
}

export function loadCourseById(courseId: string): Course | null {
  try {
    const data = localStorage.getItem(`course_${courseId}`);
    if (data) {
      localStorage.setItem(CURRENT_COURSE_KEY, courseId);
      return JSON.parse(data);
    }
    return null;
  } catch (err) {
    console.error('Failed to load course:', err);
    return null;
  }
}

// "지난 학기 과목 복사 기능"
export function duplicateCourse(sourceCourse: Course, newName?: string): Course {
  const newId = `course-${Date.now()}`;
  const duplicated: Course = {
    ...JSON.parse(JSON.stringify(sourceCourse)),
    id: newId,
    name: newName || `[복사본] ${sourceCourse.name} (차기 학기)`,
    updatedAt: new Date().toISOString(),
    weeks: sourceCourse.weeks.map((w) => ({
      ...w,
      id: `week-${Date.now()}-${w.weekNumber}`,
      updatedAt: new Date().toISOString(),
    })),
  };

  saveCourse(duplicated);
  localStorage.setItem(CURRENT_COURSE_KEY, newId);
  return duplicated;
}

export function resetToSampleCourse(): Course {
  const initialCourse: Course = {
    ...INITIAL_SAMPLE_COURSE,
    weeks: getFullWeeksForCourse(INITIAL_SAMPLE_COURSE.totalWeeks, INITIAL_SAMPLE_COURSE.weeks),
  };
  saveCourse(initialCourse);
  localStorage.setItem(CURRENT_COURSE_KEY, initialCourse.id);
  return initialCourse;
}
