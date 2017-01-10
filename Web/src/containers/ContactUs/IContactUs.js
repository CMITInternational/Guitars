type IContactUs = {
  Header1: string,
  Header2: string,
  Address: Array<string>,
  Phone: string,
  Email: string,
  BusinessHours: Array<{
    Day: string,
    Hours: string
  }>,
  Map: string,
  GoogleMap: string,
  Spot: {
    Top: string,
    Left: string
  }
};

export default IContactUs;