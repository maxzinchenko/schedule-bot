export class ScheduleService {
  public convertSchedule(data: any) {
    const days = Object.keys(data);

    return days.map(key => this.convertDay(key, data[key]));
  }

  public period(period: string) {
    const today = new Date();

    const setPeriod = (start: Date, end: Date) => ({
      startDate: start.toLocaleDateString('ru'),
      endDate: end.toLocaleDateString('ru')
    });

    switch (period) {
      case 'today':
        return setPeriod(today, today);

      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return setPeriod(tomorrow, tomorrow);

      default:
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        return setPeriod(today, week);
    }
  }

  // PRIVATE

  private convertDay(day: string, subjects: any[]) {
    return `\n\n\n<b>\u{1F5D3} ${ day }</b>\n${ subjects.map(this.convertSubject) }`
  }

  private convertSubject(subject: any, idx: number) {
    return `
<i>Пара: <b>${ idx + 1 }</b></i>
${ !subject ? '<b>Немає</b>' : `<b>Предмет:</b> ${ subject.subject }
<b>Викладач:</b> ${ subject.teacher }
<b>Аудиторiя:</b> ${ subject.audience }
<b>Збірна група:</b> ${ subject.group || 'Нi' }
<b>Час:</b> ${ subject.startAt }-${ subject.endAt }` }
`;
  }
}
