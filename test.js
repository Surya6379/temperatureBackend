function groupDatesByPeriod(dates) {
    // Ensure that the input is an array of valid Date objects
    if (!Array.isArray(dates) || dates.some(date => !(date instanceof Date))) {
      throw new Error('Input must be an array of Date objects');
    }
  
    // Helper function to format dates as dd-mm-yyyy
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  
    // Group dates by week, month, and year
    const groupedDates = {
      weeks: {},
      months: {},
      years: {}
    };
  
    dates.forEach(date => {
      const formattedDate = formatDate(date);
  
      // Group by week
      const weekStartDate = new Date(date);
      weekStartDate.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
      const formattedWeekStartDate = formatDate(weekStartDate);
  
      if (!groupedDates.weeks[formattedWeekStartDate]) {
        groupedDates.weeks[formattedWeekStartDate] = [];
      }
      groupedDates.weeks[formattedWeekStartDate].push(formattedDate);
  
      // Group by month
      const formattedMonth = `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      if (!groupedDates.months[formattedMonth]) {
        groupedDates.months[formattedMonth] = [];
      }
      groupedDates.months[formattedMonth].push(formattedDate);
  
      // Group by year
      const formattedYear = String(date.getFullYear());
      if (!groupedDates.years[formattedYear]) {
        groupedDates.years[formattedYear] = [];
      }
      groupedDates.years[formattedYear].push(formattedDate);
    });
  
    return groupedDates;
  }
  
  // Example usage:
  const dates = [
    new Date('2023-01-05'),
    new Date('2023-01-12'),
    new Date('2023-02-08'),
    new Date('2023-03-15'),
    new Date('2023-03-22'),
    new Date('2023-04-30'),
    new Date('2023-12-08')
  ];
  
  const result = groupDatesByPeriod(dates);
  console.log(result);
  