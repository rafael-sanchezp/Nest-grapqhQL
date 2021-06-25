import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'apollo-server-express';

import { Movie } from './movies.entity';
import { MovieRepository } from './movies.repository';
import { GetMovieArgs } from './dto/args/get-movies.arg';
import { MovieInput } from './dto/input/movie.input';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private readonly _MovieRepository: MovieRepository,
  ) {}

  async getMovies(): Promise<Movie[]> {
    return this._MovieRepository.find();
  }

  async getMovie(input: GetMovieArgs): Promise<Movie> {
    const { id } = input;
    const Movie = await this._MovieRepository.findOne(id);
    if (Movie) return Movie;
    throw new ValidationError(`not found Movie with this id ${id}`);
  }

  async createMovie(input: MovieInput): Promise<Movie> {
    return await this._MovieRepository.save(input);
  }
  async updateMovie(input: MovieInput): Promise<Movie> {
    const { id, ...data } = input;
    await this._MovieRepository.update(id, data);
    return this.getMovie(input);
  }

  async deleteMovie(id: string): Promise<void> {
    await this._MovieRepository.delete(id);
  }
}