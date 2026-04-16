import Car from "../models/Car.js";

const normalizeText = (value) => value?.toString().trim().toLowerCase() || "";

class RecommendationService {
  buildExplanation(reasons) {
    return reasons.slice(0, 3);
  }

  scoreCar(car, preferences) {
    let score = 0;
    const reasons = [];

    const budget = Number(preferences.budget);
    const passengers = Number(preferences.passengers);
    const carLocation = normalizeText(car.location);
    const requestedLocation = normalizeText(preferences.location);
    const requestedCategory = normalizeText(preferences.category);
    const requestedFuel = normalizeText(preferences.fuelType);
    const tripType = normalizeText(preferences.tripType);

    if (Number.isFinite(budget) && budget > 0) {
      if (car.pricePerDay <= budget) {
        score += 35;
        reasons.push("Fits within your budget");
      } else {
        const overflow = car.pricePerDay - budget;
        score += Math.max(0, 15 - Math.min(15, overflow / 10));
      }
    }

    if (Number.isFinite(passengers) && passengers > 0) {
      if (car.seating_capacity >= passengers) {
        score += 25;
        reasons.push(`Comfortably fits ${passengers} passengers`);
      } else {
        score -= 20;
      }
    }

    if (requestedFuel && normalizeText(car.fuel_type) === requestedFuel) {
      score += 15;
      reasons.push(`${car.fuel_type} matches your fuel preference`);
    }

    if (requestedCategory && normalizeText(car.category) === requestedCategory) {
      score += 12;
      reasons.push(`${car.category} matches your preferred category`);
    }

    if (requestedLocation && carLocation.includes(requestedLocation)) {
      score += 10;
      reasons.push(`Available near ${car.location}`);
    }

    if (tripType) {
      const tripRules = {
        city: ["hatchback", "sedan", "electric"],
        family: ["suv", "muv", "luxury"],
        business: ["sedan", "luxury"],
        adventure: ["suv"],
      };

      const matchingCategories = tripRules[tripType] || [];
      if (matchingCategories.includes(normalizeText(car.category))) {
        score += 10;
        reasons.push(`Well suited for ${tripType} trips`);
      }
    }

    if (car.averageRating > 0) {
      score += Math.min(10, car.averageRating * 2);
    }

    if (car.numReviews > 0) {
      score += Math.min(8, Math.log10(car.numReviews + 1) * 4);
    }

    if (!reasons.length) {
      reasons.push("Strong all-around match for your search");
    }

    return {
      ...car.toObject(),
      matchScore: Number(score.toFixed(2)),
      matchReasons: this.buildExplanation(reasons),
    };
  }

  async getRecommendations(preferences = {}) {
    const cars = await Car.find({
      isAvailable: true,
      isDeleted: false,
    })
      .populate("owner", "name email image")
      .sort({ createdAt: -1 });

    return cars
      .map((car) => this.scoreCar(car, preferences))
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }

        if (a.pricePerDay !== b.pricePerDay) {
          return a.pricePerDay - b.pricePerDay;
        }

        return a.brand.localeCompare(b.brand);
      })
      .slice(0, 6);
  }
}

export default new RecommendationService();
