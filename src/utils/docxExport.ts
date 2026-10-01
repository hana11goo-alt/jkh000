import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} from 'docx';
import { Course, WeekPlan } from '../types';

export async function generateDocxBlob(course: Course, selectedWeeks: WeekPlan[]): Promise<Blob> {
  const docChildren: any[] = [];

  // Document Title
  docChildren.push(
    new Paragraph({
      text: course.name,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '교수설계 원칙 기반 주차별 강의교안',
          italics: true,
          color: '666666',
          size: 22,
        }),
      ],
    })
  );

  // Course Information Table
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
          children: [new Paragraph({ children: [new TextRun({ text: '과목명', bold: true })] })],
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: course.name })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
          children: [new Paragraph({ children: [new TextRun({ text: '대상 및 학점', bold: true })] })],
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              text: `${course.targetAudience || '미지정'} / ${course.credits}학점 (${course.classDurationMinutes}분, ${
                course.deliveryMethod === 'face-to-face' ? '대면' : course.deliveryMethod === 'online' ? '비대면' : '혼합(블렌디드)'
              })`,
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
          children: [new Paragraph({ children: [new TextRun({ text: '과목 개요', bold: true })] })],
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: course.overview || '과목 개요가 작성되지 않았습니다.' })],
        }),
      ],
    }),
  ];

  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    })
  );

  docChildren.push(new Paragraph({ spacing: { after: 400 } }));

  // Loop through selected weeks
  selectedWeeks.forEach((week, index) => {
    // Week Title
    docChildren.push(
      new Paragraph({
        text: `제${week.weekNumber}주차: ${week.topic}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: index > 0 ? 500 : 200, after: 200 },
      })
    );

    // Status & Keywords
    docChildren.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `[상태: ${week.status === 'completed' ? '작성 완료' : week.status === 'draft' ? '초안 작성' : '미작성'}] `,
            bold: true,
            color: week.status === 'completed' ? '15803D' : 'DC2626',
          }),
          new TextRun({
            text: week.keywords?.length ? `핵심 키워드: ${week.keywords.join(', ')}` : '',
            color: '475569',
          }),
        ],
      })
    );

    // Learning Objectives
    docChildren.push(
      new Paragraph({
        text: '1. 학습목표 (Learning Objectives)',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    if (week.learningObjectives && week.learningObjectives.length > 0) {
      week.learningObjectives.forEach((obj, objIdx) => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${objIdx + 1}) ${obj}`,
              }),
            ],
            spacing: { after: 60 },
          })
        );
      });
    } else {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '(등록된 학습목표가 없습니다)',
              italics: true,
              color: '888888',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    // Key Concepts
    if (week.keyConcepts && week.keyConcepts.length > 0) {
      docChildren.push(
        new Paragraph({
          text: '2. 핵심 개념 (Key Concepts)',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      week.keyConcepts.forEach((concept) => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${concept.name}: `, bold: true }),
              new TextRun({ text: concept.description }),
            ],
            spacing: { after: 60 },
          })
        );
      });
    }

    // Generated Sections (Intro, Dev, Activity, Summary, Evaluation)
    if (week.generatedSections && week.generatedSections.length > 0) {
      docChildren.push(
        new Paragraph({
          text: '3. 교안 본문 (Lesson Plan Content)',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      week.generatedSections.forEach((sec) => {
        // Section Title
        docChildren.push(
          new Paragraph({
            text: `[${sec.sectionName}] ${sec.title} (${sec.allocatedTime}분)`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          })
        );

        // Section Bullet Items
        if (sec.items && sec.items.length > 0) {
          sec.items.forEach((item) => {
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                text: item,
                spacing: { after: 60 },
              })
            );
          });
        }

        // Summary Box
        if (sec.summaryBox) {
          docChildren.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: 'FEF2F2' },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: '💡 핵심 요약: ', bold: true, color: 'B91C1C' }),
                            new TextRun({ text: sec.summaryBox }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          );
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
        }

        // Activity Prompt
        if (sec.activity && (sec.activity.title || sec.activity.prompt)) {
          docChildren.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: 'FDF4FF' },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `🎯 활동 [${sec.activity.title || '학습자 참여'}] (${sec.activity.duration || 5}분): `,
                              bold: true,
                              color: '9333EA',
                            }),
                            new TextRun({ text: sec.activity.prompt }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          );
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
        }
      });
    }

    // Image Plans
    if (week.imagePlans && week.imagePlans.length > 0) {
      docChildren.push(
        new Paragraph({
          text: '4. 시각 자료 및 이미지 계획',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      week.imagePlans.forEach((img, imgIdx) => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `[이미지 ${imgIdx + 1}: ${img.conceptName}] `, bold: true }),
              new TextRun({ text: `유형: ${img.imageType} | 캡션: "${img.caption}" | 출처: ${img.sourceAndLicense}` }),
            ],
            spacing: { after: 60 },
          })
        );
      });
    }

    // Overall Summary & Next Week Preview
    if (week.overallSummary || week.nextWeekPreview) {
      docChildren.push(
        new Paragraph({
          text: '5. 종합 요약 및 차시 예고',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      if (week.overallSummary) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: '• 총괄 요약: ', bold: true }),
              new TextRun({ text: week.overallSummary }),
            ],
            spacing: { after: 80 },
          })
        );
      }

      if (week.nextWeekPreview) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: '• 다음 주차 예고: ', bold: true }),
              new TextRun({ text: week.nextWeekPreview }),
            ],
            spacing: { after: 80 },
          })
        );
      }
    }

    // References
    if (week.references) {
      docChildren.push(
        new Paragraph({
          text: '6. 출처 및 참고 문헌',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: week.references,
              italics: true,
              color: '64748B',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    docChildren.push(new Paragraph({ spacing: { after: 400 } }));
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
